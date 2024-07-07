import React, { useState } from 'react';
import icon from '../../assets/Images/icon.png';
import './Navbar.css';

const Navbar = () => {
  const [roomId, setRoomId] = useState('');

  const handleLeaveRoom = () => {
    document.cookie = 'roomId=;';
    const event = new Event('cookieChange');
    window.dispatchEvent(event);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim() !== '') {
      document.cookie = `roomId=${roomId}`;
      const event = new Event('cookieChange');
      window.dispatchEvent(event);
      setRoomId(''); // Reset input after submission
    } else {
      toast.error('Please enter a Room ID');
    }
  };

  return (
    <nav>
      <div id="logo">
        <img src={icon} alt="icon" />
        <h1>Dropify</h1>
      </div>

     

     <div id="nav-right"> <form id="join-room" onSubmit={joinRoom}>
        <div className="group">
          <input
            type="text"
            className="input"
            name="roomId"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
        

        <button type="submit" id="joinRoom-btn">
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

        <button className="Btn" onClick={handleLeaveRoom}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <div className="text">Leave Room</div>
      </button></div>
    </nav>
  );
};

export default Navbar;
