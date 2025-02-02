import { ClickAwayListener, Tooltip } from "@mui/material";
import { useState } from "react";

const MuiTooltip = ({ children, title, placement }: any) => {
   const [open, setOpen] = useState(false);

   const handleTooltipClose = () => {
      setOpen(false);
   };

   const handleTooltipOpen = () => {
      setOpen(true);
   };

   return (
      <ClickAwayListener onClickAway={handleTooltipClose}>
         <Tooltip
            title={title}
            open={open}
            onClose={handleTooltipClose}
            placement={placement}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            slotProps={{
               popper: {
                  disablePortal: true,
                  sx: {
                     "& .MuiTooltip-tooltip": {
                        width: "250px",
                        backgroundColor: "white",
                        borderRadius: "8px 8px 8px 0",
                        color: "black",
                        fontSize: "14px",
                        boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
                     },
                  },
               },
            }}
         >
            <button onClick={handleTooltipOpen} className="">
               {children}
            </button>
         </Tooltip>
      </ClickAwayListener>
   );
};

export default MuiTooltip;
