import "./gsap-config";
import { lazy, Suspense } from "react";
import "./App.css";
import TargetCursor from "./components/utils/TargetCursor";

const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <>
      <LoadingProvider>
        <TargetCursor />
        <Suspense>
          <MainContainer />
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
