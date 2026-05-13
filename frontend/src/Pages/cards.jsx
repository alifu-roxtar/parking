function Cards({ children }) {
    return (
        <div className="flex flex-col h-40 w-90 rounded-xl bg-transparent border border-blue-400 shadow-xl hover:scale-105 transition-all">
            { children }
        </div>
    )
}

export default Cards;