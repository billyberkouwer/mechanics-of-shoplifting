import useWindowSize from '../../hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { AnimatePresence } from 'framer-motion';
import Candle from '../../components/Candle';
import Background from '../../components/Background';
import useMousePosition from '../../hooks/useMousePosition';
import { createClient } from '@sanity/client';
import ThreeCanvasPage from '../../components/ThreeCanvasPage';
import Page from '../../components/Page';
import { isMobile } from 'react-device-detect';


export default function Home({ content }) {
  const [swipeData, setSwipeData] = useState({ index: 0, direction: undefined });
  const pageRefs = useRef([]);
  const pagesContainerRef = useRef();
  const backgroundContainerRef = useRef([]);
  const globalContainerRef = useRef();
  const scrollAmount = useRef(0);
  const windowSize = useWindowSize();
  const mousePosition = useMousePosition();

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
    if (swipeData.direction === 'Left') {
      scrollAmount.current = scrollAmount.current + pageRefs.current[swipeData.index].offsetWidth;
    }
    if (swipeData.direction === 'Right') {
      scrollAmount.current = scrollAmount.current - pageRefs.current[swipeData.index].offsetWidth;
    }
    if (pageRefs.current.length) {
      pagesContainerRef.current.style.transform = `translateX(${-scrollAmount.current}px)`;
      backgroundContainerRef.current.forEach((container) => { container.style.transform = `translateX(${-scrollAmount.current}px)` })
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
    onSwiped: (e) => handleSwipe(e),
    trackMouse: true,
  });


  useEffect(() => {
    function callback() {
      document.body.style.transform = `translate(${(-mousePosition.current.mouse.pageX + (window.innerWidth / 2))/10}px, ${(-mousePosition.current.mouse.pageY + (window.innerHeight / 2)) / 10}px)`
  }
    if (mousePosition && !isMobile) {
      window.addEventListener("mousemove", callback)
      return () => {
        window.removeEventListener("mousemove", callback)
      }
    }
  }, [mousePosition])

  return (
    <div ref={globalContainerRef} {...swipeHandlers} className='swiper--control'>
      <Background windowSize={windowSize} ref={backgroundContainerRef} />
      <div className='container--pages'  ref={pagesContainerRef}  >
        <AnimatePresence>
          {content.map((page, index) => {
              console.log(page)
              return (
                  <Page key={'page' + index} ref={pageRefs} index={index} swipeIndex={swipeData.index} content={page.content} footnotes={page.references} />
              )
          }
          )}
          {/* <ThreeCanvasPage key={'3d-page'} ref={pageRefs} index={0} swipeIndex={swipeData.index} model={'/assets/3d/monkey.glb'} /> */}
        </AnimatePresence>
      </div>
      <Candle />
    </div>
  )
};

export async function getStaticProps() {
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false,
  });

  const pageOrder = await client.fetch(`*[_type == "pageOrder"]`);
  const pages = await client.fetch(`*[_type == "page"]`);
  const references = await client.fetch('*[_type == "references"]');
  const content = [];

  if (pageOrder.length) {
    if (pageOrder[0].pages.length) {
      pageOrder[0].pages.forEach((orderedPage, index) => {
        pages.forEach((page, i) => {
          if (orderedPage['_ref'] === page['_id']) {
            content.push(page);
            page.references = [];
            page.content.forEach((block) => {
              block.markDefs.forEach((mark) => {
                references.forEach((reference) => {
                  if (mark['_ref'] === reference['_id']) {
                    content[index].references.push(reference);
                  }
                })
              })
            })
          }
        });
      })
    }
  }

  return {
    props: {
      content: content,
    },
    revalidate: 10,
  }
}
