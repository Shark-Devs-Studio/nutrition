import React from "react";

const CustomBarItem = ({ x, y, height, start, end, progress }: any) => {
   console.log(x, y);

   return (
      <div
         style={{
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            transform: "translate(-50%, 0)",
            zIndex: -1,
         }}
      >
         <span
            style={{
               display: "block",
               color: "red",
               fontSize: "12px",
               textAlign: "center",
               marginBottom: "2px",
            }}
         >
            {end}
         </span>

         <div
            style={{
               width: "40px",
               height: `${height}px`,
               borderRadius: "20px",
               overflow: "hidden",
               position: "relative",
            }}
         >
            <div
               style={{
                  width: "100%",
                  height: `100%`, // Пропорциональное заполнение
                  backgroundColor: progress === 100 ? "blue" : "green", // Синий если 100%, иначе зелёный
                  position: "absolute",
                  bottom: 0, // Заполняется снизу вверх
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  transition: "height 0.3s ease-in-out",
               }}
            ></div>
         </div>

         <span
            style={{
               display: "block",
               color: "red",
               fontSize: "12px",
               textAlign: "center",
               marginTop: "2px",
            }}
         >
            {start}
         </span>
      </div>
   );
};

export default CustomBarItem;
