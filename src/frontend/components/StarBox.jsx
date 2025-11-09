export default function StarBox( {starCount}) {
    return (
        <div className="mt-8">
            <p className="text-lg font-medium mb-4">
                Star Count: {starCount}!
            </p>
            <div className="flex text-5xl">
                {" ⭐ ".repeat(starCount)}
            </div>
        </div>
    );
}