import { useEffect, useState } from 'react';
import './App.css';
import image from './assets/image.png'; // Import the image
import succanct from './assets/image2.png'; // Import the image
import backgroundImage from './assets/succintss.png'; // Import the background image
import Nav from './Components/Nav';
import Instructions from './Components/Instructions';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Import sound files
import correctSound from './assets/sounds/correct.mp3';
import boomSound from './assets/sounds/boom.mp3';
import bgMusic from './assets/sounds/bg-music.mp3';

function App() {
  const boxes = Array(64).fill(null); // Create an array with 64 null elements
  const [mineData, setMineData] = useState({ numOfMines: 1, mineNum: [] });
  const { numOfMines, mineNum } = mineData;
  const [openedBox, setOpenedBox] = useState([]);

  // Preload sound files
  const [correctAudio, setCorrectAudio] = useState(null);
  const [boomAudio, setBoomAudio] = useState(null);
  const [backgroundAudio, setBackgroundAudio] = useState(null);

  useEffect(() => {
    // Load sound files when the component mounts
    setCorrectAudio(new Audio(correctSound));
    setBoomAudio(new Audio(boomSound));
    setBackgroundAudio(new Audio(bgMusic));
  }, []);

  // Sound effects
  const playCorrectSound = () => {
    console.log('Playing correct sound'); // Debugging log
    if (correctAudio) {
      correctAudio.currentTime = 0; // Reset audio to start
      correctAudio.play().catch((error) => console.error('Error playing correct sound:', error));
    }
  };

  const playBoomSound = () => {
    console.log('Playing boom sound'); // Debugging log
    if (boomAudio) {
      boomAudio.currentTime = 0; // Reset audio to start
      boomAudio.play().catch((error) => console.error('Error playing boom sound:', error));
    }
  };

  // Background game sound
  const playBackgroundSound = () => {
    console.log('Playing background sound'); // Debugging log
    if (backgroundAudio) {
      backgroundAudio.loop = true; // Loop the background sound
      backgroundAudio.play().catch((error) => console.error('Error playing background sound:', error));
    }
  };

  // Start background sound on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      playBackgroundSound();
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [backgroundAudio]);

  useEffect(() => {
    setMine();
  }, [numOfMines]);

  const setMine = () => {
    setOpenedBox([]);
    const mines = new Set(); // Use a Set to ensure unique mine positions

    while (mines.size < numOfMines) {
      const mine = Math.floor(Math.random() * 64); // Generate a random number between 0 and 63
      mines.add(mine);
    }

    setMineData({ ...mineData, mineNum: Array.from(mines) });
  };

  const checkBoxEntry = (num) => {
    if (mineNum.includes(num)) {
      // Play boom sound
      playBoomSound();

      // Reveal the mine
      setOpenedBox((prev) => [...prev, num]);

      // Show the loss alert using SweetAlert2
      Swal.fire({
        title: 'You Lost!',
        text: `Your final Score is ${openedBox.length}`,
        icon: 'error',
        confirmButtonText: 'Play Again',
      }).then(() => {
        // Add a delay before resetting the game
        setTimeout(() => {
          setMine(); // Reset the game after 0.5 second
        }, 500); // 1000ms = 1 second
      });
    } else if (openedBox.includes(num)) {
      // Show "Box already opened" alert using SweetAlert2
      Swal.fire({
        title: 'Oops!',
        text: 'Box already opened',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else {
      // Play correct sound
      playCorrectSound();

      setOpenedBox((prev) => [...prev, num]);
      console.log('Continue');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      <Nav />
      <Instructions />
      <div className='flex flex-col items-center mt-5'>
        <section className='text-white flex justify-between max-w-96 space-x-10'>
          <div>
            Mines Count:{' '}
            <select
              value={numOfMines}
              onChange={(e) => setMineData({ ...mineData, numOfMines: parseInt(e.target.value) })}
              className='bg-white text-black rounded-md'
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1} className='bg-white text-green-500'>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            Your Score: <span className='text-green-500 font-semibold'>{openedBox.length}</span>
          </div>
        </section>
        <div className='grid grid-cols-8 max-w-100 border-2 border-white-500 p-3 rounded-md'>
          {boxes.map((_, index) => (
            <div
              key={index}
              onClick={() => checkBoxEntry(index)}
              className={`h-10 w-10 bg-pink-100 rounded-sm hover:scale-105 hover:cursor-pointer m-2`}
            >
              {openedBox.includes(index) ? (
                mineNum.includes(index) ? ( // Check if the box is a mine
                  <img src={succanct} alt="Succanct" className="w-full h-full" />
                ) : (
                  <h1 className='text-xl w-full h-full rounded-sm scale-105 bg-green-600 m-auto'>
                    <img src={image} alt="Ferris" className="w-full h-full" />
                  </h1>
                )
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
