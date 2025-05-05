interface LayoutProps {
  children?: React.ReactNode;
}

function Layout(props: LayoutProps) {
  return (
    <div>
      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
