import useWindowSize from '../../hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { AnimatePresence } from 'framer-motion';
import Candle from '../../components/Candle';
import Background from '../../components/Background';
import useMousePosition from '../../hooks/useMousePosition';
import { createClient } from '@sanity/client';
import Page from '../../components/Page';
import { isMobile } from 'react-device-detect';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import ThreeScene from '../../components/ThreeScene';


export default function Home({ content, pageOrder }) {
  const [swipeData, setSwipeData] = useState({ index: 0, direction: undefined });
  const pageRefs = useRef([]);
  const pagesContainerRef = useRef();
  const backgroundContainerRef = useRef([]);
  const globalContainerRef = useRef();
  const scrollAmount = useRef(0);
  const windowSize = useWindowSize();
  const mousePosition = useMousePosition();
  const [eyeController, setEyeController] = useState({ backward: false, visible: false })
  const [isDesktop, setIsDesktop] = useState(undefined);

  function handleSwipe(e) {
    if (e.dir === 'Left' && swipeData.index < content.length - 1) {
      const data = {
        index: swipeData.index += 1,
        direction: e.dir
      }
      setSwipeData(data);
    } else if (e.dir === 'Right' && swipeData.index > 0) {
      const data = {
        index: swipeData.index -= 1,
        direction: e.dir
      }
      setSwipeData(data);
    }
  }

  useEffect(() => {
    if (isMobile) {
      setIsDesktop(false);
    }
    if (!isMobile) {
      setIsDesktop(true)
    }
  }, [])

  useEffect(() => {
    if (swipeData.direction === 'Left') {
      scrollAmount.current = scrollAmount.current + pageRefs.current[swipeData.index - 1].offsetWidth;
    }
    if (swipeData.direction === 'Right') {
      scrollAmount.current = scrollAmount.current - pageRefs.current[swipeData.index].offsetWidth;
    }
    if (pageRefs.current.length) {
      pagesContainerRef.current.style.transform = `translateX(${-scrollAmount.current}px)`;
    }
    console.log(pageRefs)
  }, [swipeData])

  useEffect(() => {
    document.addEventListener('resize', function () {
      let totalScrollAmount = 0;
      pageRefs.current.forEach((page) => {
        totalScrollAmount += page.offsetWidth;
      })
      scrollAmount.current = scrollAmount;
      pagesContainerRef.current.style.transform = `translateX(${-scrollAmount.current}px)`;
    })
  }, [])

  const swipeHandlers = useSwipeable({
    onSwiped: (e) => handleSwipe(e),
  });


  useEffect(() => {
    function callback() {
      document.body.style.transform = `translate(${(-mousePosition.current.mouse.pageX + (window.innerWidth / 2)) / 10}px, ${(-mousePosition.current.mouse.pageY + (window.innerHeight / 2)) / 10}px)`
    }
    if (mousePosition && !isMobile) {
      window.addEventListener("mousemove", callback)
      return () => {
        window.removeEventListener("mousemove", callback)
      }
    }
  }, [mousePosition])

  return (
    <>
      <div
        className={`click-area-left ${isDesktop ? null : 'hidden'}`}
        onMouseEnter={() => { swipeData.index < content.length - 1 && setEyeController({ backward: false, visible: true }) }}
        onMouseLeave={() => setEyeController({ backward: false, visible: false })}
        onClick={() => handleSwipe({ dir: 'Left' })}
      />
      <div
        className={`click-area-right ${isDesktop ? null : 'hidden'}`}
        onMouseEnter={() => swipeData.index > 0 && setEyeController({ backward: true, visible: true })}
        onMouseLeave={() => setEyeController({ backward: true, visible: false })}
        onClick={() => handleSwipe({ dir: 'Right' })}
      />
      <div ref={globalContainerRef} {...swipeHandlers} className='swiper--control'>
        <div className='container--pages' ref={pagesContainerRef}  >
          <Background windowSize={windowSize} ref={backgroundContainerRef} />
          <AnimatePresence>
            {content.map((page, index) => {
              if (page["_type"] === 'homepage') {
                return (
                  <div ref={el => pageRefs.current[index] = el} key="homepage" className='container--homepage'>
                    <h1>{page.siteTitle}</h1>
                  </div>
                )
              }
              if (page["_type"] === "threePage") {
                return (
                  <ThreeScene key={'three-scene'} model={page.model.modelUrl} ref={pageRefs} index={index} />
                )
              }
              return (
                <Page key={'page' + index} ref={pageRefs} index={index} swipeIndex={swipeData.index} content={page.content} footnotes={page.references} />
              )
            }
            )}
          </AnimatePresence>
        </div>
        <Candle eyeController={eyeController} />
      </div>
    </>
  )
};

export async function getStaticProps() {
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
  });

  const pageOrder = await client.fetch(`*[_type == "pageOrder"]`);
  const references = await client.fetch('*[_type == "references"]');
  const threeModels = await client.fetch(`*[_type == "threePage"]{
    id,
    "modelUrl": threeFile.asset->url
  }`);
  const content = [];

  const promises = pageOrder[0].pages.map(async (page) => await client.fetch(`*[_id == "${page['_ref']}"]`))
  const response = await Promise.all(promises);

  response.forEach((page, i) => {
    content.push(...page);
    content[i].references = [];
    if (page[0]['_type'] === 'threePage') {
      threeModels.forEach(model => {
        if (model['_id'] === model['_id']) {
          content[i].model = model;
          console.log(model)
        }
      })
    }
    if (page[0]['_type'] === 'page') {
      page[0].content.forEach((block) => {
        block.markDefs.forEach(mark => {
          references.forEach(ref => {
            if (ref['_id'] === mark['_ref'] && mark['_ref']) {
              content[i].references.push(ref);
            }})
        })
      })
    }
  });

  return {
    props: {
      content: content,
      pageOrder: pageOrder
    },
    revalidate: 10,
  }
}
