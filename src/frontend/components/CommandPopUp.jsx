export default function CommandPopUp({
    visible,
    onClose,
    command,
    mode,
    textTranslations,
}) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 scale-150">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                <button onClick={onClose} className="
                        bg-purple-600 text-white
                        text-xs
                        px-2 py-1 
                        rounded-full
                        shadow-sm
                        hover:bg-purple-700"> 
                    {textTranslations.goBack} 
                </button>

                {mode === "star" && ( <h2 className="text-xl font-semibold">{textTranslations.starHeader}</h2> )}
                <div className="flex flex-row justify-between items-start gap-6 mt-4">
                    <div className="text-black rounded border-2 border-blue-500 flex flex-col items-center justify-center w-40 h-40">
                        <span className="text-sm">{command.userLangText}</span>
                            <img
                                src={command.img}
                                alt="button image"
                                className="w-12 h-12 my-2"
                            />
                        <span className="text-sm">{command.targetLangText}</span>
                    </div>

                    <div className="flex flex-col items-end space-y-4">
                        {mode === "normal" ? ( <> 
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full">{textTranslations.tryOnOwn}</button> 
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full">{textTranslations.sendToTeacher}</button> 
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full">{textTranslations.playOutLoud}</button> 
                            </> ) 
                            : 
                            ( <> 
                            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full">{textTranslations.yesTry}</button> 
                            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg w-full">{textTranslations.noTry}</button> 
                            <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg w-full">{textTranslations.playOutLoud}</button> 
                            </> )
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}