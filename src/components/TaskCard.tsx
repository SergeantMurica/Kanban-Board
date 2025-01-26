import {Id, Task} from "../types.ts";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}


function TaskCard({task, deleteTask, updateTask} : Props) {

    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
    const [editCard, setEditCard] = useState<boolean>(false);



    {/*DRAGGING*/}
    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editCard,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };


    {/*EDIT MODE*/}

    const toggleEdit = () => {
        setEditCard(!editCard);
        setMouseIsOver(false);
    };


    if (isDragging) {
        return (
            <div>Dragging</div>
        )
    }


    if (editCard) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="
                bg-(--background-color)
                p-2.5
                h-[100px]
                min-h-[100px]
                items-center
                flex
                text-left
                rounded-xl
                hover:ring-2
                hover:ring-inset
                hover:ring-rose-500
                cursor-grab
                relative"
                >
                <textarea
                    className="
                    h-[90%]
                    w-full
                    resize-none
                    border-none
                    rounded
                    bg-transparent
                    text-white
                    focus:outline-none"
                    value={task.content}
                    autoFocus
                    placeholder="Task Content Here"
                    onBlur={toggleEdit}
                    onMouseDown={(e) => {
                        if (!mouseIsOver && e.button) toggleEdit();
                    }}
                    onChange={(e) => {updateTask(task.id, e.target.value)}}
                ></textarea>
            </div>
        )
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={toggleEdit}
            className="
                bg-(--background-color)
                p-2.5
                h-[100px]
                min-h-[100px]
                items-center
                flex
                text-left
                rounded-xl
                hover:ring-2
                hover:ring-inset
                hover:ring-rose-500
                cursor-grab
                relative
                task"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            <p
                className="
                my-auto
                h-[90%]
                w-full
                overflow-y-auto
                overflow-x-hidden
                whitespace-pre-wrap"
            >
                {task.content}
            </p>
            {mouseIsOver && (
                <button
                    onClick={() => {
                        deleteTask(task.id);
                    }}
                    className="
                    stroke-white
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    p-2
                    rounded
                    bg-(--background-color)"
                >
                    <DeleteOutlineIcon/>
                </button>
            )}
        </div>
    )
}

export default TaskCard;
