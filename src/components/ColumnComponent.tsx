import {Column, Id, Task} from "../types.ts";
import TaskCard from "./TaskCard.tsx";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {useMemo, useState} from "react";
import {CSS} from "@dnd-kit/utilities"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


interface Props {
    column: Column,
    deleteColumn: (id: Id) => void,
    updateColumn?: (id: Id, title: string) => void
    createTask: (column: Id) => void,
    deleteTask: (id: Id) => void,
    updateTask: (id: Id, content: string) => void,
    tasks: Task[],
}


function ColumnComponent(props: Props) {


    const {column, deleteColumn, updateColumn, tasks, createTask, deleteTask, updateTask} = props;
    const [editMode, setEditMode] = useState(false);


    const taskIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);


    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
                flex
                flex-col
                gap-4
                w-[350px]
                h-[500px]
                rounded-md
                bg-(--base-color)
                opacity-60
                border-2
                border-gray-200 
                ">

            </div>
        )
    }


    return (

        <div
            ref={setNodeRef}
            style={style}
            className="
            flex
            flex-col
            gap-4
            w-[350px]
            h-[500px]
            rounded-md
            bg-(--base-color)
            ">

            {/* Column Title*/}
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true)
                }}
                className="
                text-md
                h-[60px]
                cursor-grab
                rounded-md
                rounded-b-none
                bg-(--base-color)
                border-(--main-outline-color)
                p-3
                font-bold
                border-4
                flex
                items-center
                justify-between
                ">
                <div className="flex gap-2">
                    <div
                        className="
                        flex
                        items-center
                        justify-center
                        bg-(--base-color)
                        px-2
                        py-1
                        text-small
                        rounded-full
                        ">
                        0
                    </div>
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            className="bg-gray-700 border rounded outline-none px-2 focus:border-rose-500"
                            value={column.title}
                            onChange={(e) => {
                                if (updateColumn) {
                                    updateColumn(column.id, e.target.value);
                                }
                            }}
                            autoFocus
                            onBlur={() => setEditMode(false)}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false)
                            }}
                        />
                    )}
                </div>
                <button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    className="
                    stroke-gray-500
                    hover:stroke-white
                    "
                ><DeleteOutlineIcon/></button>
            </div>

            {/*Column Task*/}
            <div className="
            flex
            flex-grow
            flex-col
            gap-4
            p-2
            overflow-x-hidden
            overflow-y-auto
            ">
                <SortableContext items={taskIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                    ))}
                </SortableContext>
            </div>

            {/*Footer*/}
            <div>
                <button
                    className="
                    flex
                    gap-2
                    items-center
                    rounded-md
                    p-4
                    border-x-(--background-color)
                    hover:bg-(--base-color)
                    hover:text-rose-500
                    "
                    onClick={() =>{createTask(column.id)}}
                >
                    <AddCircleOutlineIcon/>
                    Add a task
                </button>
            </div>
        </div>
    )

}

export default ColumnComponent;