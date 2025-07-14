import { useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export function usePrompt(when, messageCallback) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      messageCallback(() => push(...args));
    };

    return () => {
      navigator.push = push;
    };
  }, [when, messageCallback, navigator]);
}
