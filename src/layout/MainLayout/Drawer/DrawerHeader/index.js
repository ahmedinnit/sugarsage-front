import Logo from 'components/Logo';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  return (
    <>
      <Logo open={open} />
      <div className="border-t h-0.5 bg-neutral-200"></div>
    </>
  );
};

export default DrawerHeader;
