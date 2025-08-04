import Link from "next/link";

const NotFound = () => {
  return (
    <div className=" fixed top-0 left-0 flex items-center justify-center flex-col">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
};
export default NotFound;
