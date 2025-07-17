import { useRef } from "react";


const UseThrottleFunction = (callback, delay) => {

    const lastCallRef = useRef(0);
    const throttleCallback = (...args) => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
            lastCallRef.current = now;
            callback(...args);
        }
    }
    return throttleCallback;;
}

export default UseThrottleFunction;