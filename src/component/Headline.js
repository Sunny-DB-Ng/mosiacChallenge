import {Draggable} from "react-beautiful-dnd"

export default function Headline(props) {

    function openArticle() {
        window.open(props.source);
    }

    return (
        <div className="articleHeadline" onClick={openArticle}>
            {props.title}
        </div>
    );
}