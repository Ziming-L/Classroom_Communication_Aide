/**
 * Tooltip Component
 *
 * Renders a floating tooltip near a given element's position.
 *
 * @param {Object} props
 * @param {DOMRect} props.position - The bounding rectangle of the target element
 * @param {string} props.text - The tooltip text to display
 * @param {number} [props.maxWidth = 200] - Maximum width of the tooltip in pixels
 * @param {number} [props.offsetTBottom = 8] - Vertical offset from the bottom of the target element
 * @param {number} [props.offsetLeft = 0] - Horizontal offset from the left of the target element
 * @param {boolean} [props.center = false] - Whether to center the tooltip horizontally relative to the target
 * @param {boolean} [props.adjustForLargeScreen = false] - Whether to use a custom offset for large screens
 * @param {number} [props.largeScreenOffset = -38] - Vertical offset to apply for large screens if adjustForLargeScreen is true
 * @param {boolean} [props.isLargeScreen = false] - Flag indicating whether is considered large
 * 
 * @returns {JSX.Element|null} A positioned tooltip, or null if no position is provided
 */
export default function Tooltip({position, text, maxWidth = 200, offsetTBottom = 8, offsetLeft = 0, center = false, adjustForLargeScreen = false, largeScreenOffset= -38, isLargeScreen = false }) {
    if (!position) return null;

    const top = adjustForLargeScreen && isLargeScreen ? position.top + largeScreenOffset : position.bottom + offsetTBottom;

    const style = {
        top, 
        left: (position.left ?? 0) + (center ? position.width / 2 + offsetLeft : offsetLeft), 
        transform: center ? "translateX(-50%)" : undefined,
        maxWidth: `${maxWidth}px`,
        whiteSpace: "normal",
    };

    return (
        <div
            className="absolute bg-white/80 text-black px-3 py-2 rounded-lg shadow-lg text-sm backdrop-blur-sm text-center"
            style={style}
        >
            {text}
        </div>
    );
}