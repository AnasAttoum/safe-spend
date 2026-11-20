import DesktopHeader from "./desktop/desktop-header";

export default function Header({ simple = false }: { simple?: boolean }) {
  return (
    <>
      <DesktopHeader simple={simple} />
      {/* <MobileHeader /> */}
    </>
  );
}
