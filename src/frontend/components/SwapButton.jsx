import SwapIcon from "../images/translate_screen/flip.png"

/**
 * SwapButton Component
 *
 * @param {Object} props
 * @param {Function} props.onSwap - Callback function to execute when the button is clicked
 * 
 * @returns {JSX.Element} The swap button element
 */
export default function SwapButton({onSwap}) {
    return (
        <button onClick={onSwap} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md transition">
            <img src={SwapIcon} alt="Swap" className="w-9 h-9 transform md:rotate-0 rotate-90 transition-transform duration-200"/>
        </button>
    );
}