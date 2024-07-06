import React from 'react';
import icon from "../../assets/Images/icon.png"
import "./Navbar.css";

const Navbar = () => {
  const joinRoom = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const roomId = data.get("roomId");
    console.log(roomId);
  };

  return (
    <nav>
      <div id="logo">
        <img src={icon} alt="icon" />
        <h1>Dropify</h1>
      </div>
      <form id="join-room" onSubmit={joinRoom}>
        <input type="text" id="roomId" name="roomId" placeholder='Enter Room ID:'/>
        <button type="submit" id='joinRoom-btn'>
  <div className="svg-wrapper-1">
    <div className="svg-wrapper">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path
          fill="currentColor"
          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
        ></path>
      </svg>
    </div>
  </div>
  <span>Join</span>
</button>

        
      </form>
    </nav>
  );
};

export default Navbar;
