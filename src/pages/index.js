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
import Eye from '../../components/Eye';
import ClickableArea from '../../components/Navigation';
import Navigation from '../../components/Navigation';


export default function Home({ content, pageOrder, projectInfo }) {
  const [swipeData, setSwipeData] = useState({ index: 0, direction: undefined });
  const pageRefs = useRef([]);
  const pagesContainerRef = useRef();
  const backgroundContainerRef = useRef([]);
  const globalContainerRef = useRef();
  const scrollAmount = useRef(0);
  const windowSize = useWindowSize();
  const mousePosition = useMousePosition();
  const [isDesktop, setIsDesktop] = useState(undefined);
  const [isProjectInfoDisplayed, setIsProjectInfoDisplayed] = useState(false)

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
    onSwiped: (e) => {if (content[swipeData.index]['_type'] === "threePage") { if (e.velocity > 0.9) {handleSwipe(e)}} else {handleSwipe(e)}},
  });


  useEffect(() => {
    document.body.style.height = windowSize.y + 'px';
    if (globalContainerRef.current) {
      globalContainerRef.current.style.minHeight = windowSize.y + 'px';

    }
  }, [windowSize])

  useEffect(() => {
    if (isDesktop) {
      function callback() {
        document.body.style.transform = `translate(${(-mousePosition.current.mouse.pageX + (window.innerWidth / 2)) / 10}px, ${(-mousePosition.current.mouse.pageY + (window.innerHeight / 2)) / 10}px)`
      }
      if (mousePosition && !isMobile) {
        window.addEventListener("mousemove", callback)
        return () => {
          window.removeEventListener("mousemove", callback)
        }
      }
    }
  }, [mousePosition, isDesktop])

  return (
    <>
      <div ref={globalContainerRef} {...swipeHandlers} className='swiper--control'>
        <div className='container--pages' ref={pagesContainerRef}  >
          <Background windowSize={windowSize} ref={backgroundContainerRef} isDisplayed={swipeData.index === 0} />
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
                  <ThreeScene isActive={swipeData.index === index || swipeData.index === index - 1 ? true : false} pageTitle={page.pageTitle} key={'three-scene' + index} model={page.model.modelUrl} ref={pageRefs} />
                )
              }
              return (
                <Page key={'page' + index} ref={pageRefs} isActive={swipeData.index === index} content={page.content} footnotes={page.references} />
              )
            }
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode='wait'>
          {isProjectInfoDisplayed ? <div key={"info-page"} className='container--pages'>
              <Page ref={pageRefs} isProjectInfoPage content={projectInfo[0].content} />
          </div> : null}
        </AnimatePresence>
        <Navigation setSwipeData={setSwipeData} isDesktop={isDesktop} swipeData={swipeData} handleSwipe={handleSwipe} contentLength={content.length} setIsProjectInfoDisplayed={setIsProjectInfoDisplayed}  />
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
  const projectInfo = await client.fetch(`*[_type == "projectInfo"]`);
  const references = await client.fetch('*[_type == "references"]');
  const threeModels = await client.fetch(`*[_type == "threePage"]{
    _id,
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
        if (page[0]['_id'] === model['_id']) {
          content[i].model = model;
        }
      })
    }
    if (page[0]['_type'] === 'page') {
      page[0].content.forEach((block) => {
        block.markDefs.forEach(mark => {
          references.forEach(ref => {
            if (ref['_id'] === mark['_ref'] && mark['_ref']) {
              content[i].references.push(ref);
            }
          })
        })
      })
    }
  });

  return {
    props: {
      content: content,
      projectInfo: projectInfo,
      pageOrder: pageOrder
    },
    revalidate: 60,
  }
}
