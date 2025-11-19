export default function CommandPopUp({
    visible,
    onClose,
    command,
    mode,
    textTranslations,
}) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                <button onClick={onClose}> 
                    {textTranslations.goBack} 
                </button>
            </div>
        </div>
    );
}