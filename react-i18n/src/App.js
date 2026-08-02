import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export const App = () => {
    const [count, setCount] = useState(0);
    return (_jsxs("div", { className: "p-6 bg-blue-50 rounded-xl border border-blue-200", children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Embedded React App \uD83D\uDE80" }), _jsx("p", { className: "text-blue-700 mt-1", children: "This component is bundled into Blogger CDATA." }), _jsxs("button", { onClick: () => setCount((c) => c + 1), className: "mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors cursor-pointer", children: ["Clicks: ", count] })] }));
};
