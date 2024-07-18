import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import Newpage from "./Newpage";
const Email = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("newpage");


//   const email = "patiltejal439@gmail.com";

  const addbutton = () => {
    console.log("hello");
    navigate('/next', { state: { data } });
   
  };
  return (
    <div>
        <textarea value={data}>
            {/* {activeLink === "newpage" ? (
                <Newpage/>
            ) : null} */}
        </textarea>
      <button onClick={addbutton}>click</button>
    </div>
  );
};
export default Email;
