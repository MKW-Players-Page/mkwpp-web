import { Link } from "react-router-dom";

export interface ScrollListItemProps {
  scrollToId: string;
  children: string;
}
const ScrollListItem = ({ children, scrollToId }: ScrollListItemProps) => {
  return (
    <li>
      <Link
        onClick={() =>
          window.scrollTo({
            top:
              (document.getElementById(scrollToId)?.getBoundingClientRect().top || 1) -
              document.getElementsByClassName("header")[0].getBoundingClientRect().height,
            behavior: "smooth",
          } as ScrollToOptions)
        }
        to={`#${scrollToId}`}
      >
        {" "}
        {children}
      </Link>
    </li>
  );
};

export default ScrollListItem;
