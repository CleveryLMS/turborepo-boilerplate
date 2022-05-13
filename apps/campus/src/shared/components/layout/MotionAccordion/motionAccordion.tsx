import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Accordion = ({children}:{children: any}) => {
    const [expanded, setExpanded] = useState(false)
  
    // By using `AnimatePresence` to mount and unmount the contents, we can animate
    // them in and out while also only rendering the contents of open accordions
    return (
      <>
        <motion.header
          initial={false}
          animate={{ backgroundColor: expanded ? "#FF0088" : "#0055FF" }}
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              {children}
            </motion.section>
          )}
        </AnimatePresence>
      </>
    );
  };