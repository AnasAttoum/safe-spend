import Bounded from "../bounded";
import DesktopHeader from "./desktop/desktop-header";
import MobileHeader from "./mobile/mobile-header";

export default function Header() {
  return (
    <Bounded>
      <DesktopHeader />
      <MobileHeader />
    </Bounded>
  );
}
