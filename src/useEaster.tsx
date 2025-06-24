import { ReactNode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const styles = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  background: "#000",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: "99999",
};

export type UseEasterCheat = { code: string; egg: ReactNode };

export const useEaster = (cheats: Array<UseEasterCheat>) => {
  const eggRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  useEffect(() => {
    let typed = "";

    function destroyDiv() {
      if (eggRef.current && rootRef.current) {
        rootRef.current.unmount();
        document.body.removeChild(eggRef.current);
        eggRef.current = null;
        rootRef.current = null;
      }
    }

    const onKeyup = function (event: KeyboardEvent) {
      const character = event.key;
      typed += character;

      const cheat = cheats.find((cheat) => cheat.code.startsWith(typed));
      if (cheat) {
        if (cheat.code === typed) {
          destroyDiv();

          const div = document.createElement("div");
          Object.assign(div.style, styles);
          div.onclick = destroyDiv;

          document.body.appendChild(div);
          eggRef.current = div;

          const root = createRoot(div);
          root.render(<>{cheat.egg}</>);
          rootRef.current = root;

          typed = "";
        }
      } else {
        typed = "";
        destroyDiv();
      }
    };

    window.addEventListener("keyup", onKeyup);
    return () => {
      window.removeEventListener("keyup", onKeyup);
      destroyDiv();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
