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
                min-w-[320px]
                max-w-[320px]
                h-[550px]
                bg-gray-100 dark:bg-gray-900
                rounded-lg
                border border-rose-400 dark:border-rose-600
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
            min-w-[320px] max-w-[320px]
            h-[550px]
            bg-white dark:bg-gray-800
            rounded-lg
            shadow-lg
            border border-gray-200 dark:border-gray-700
            overflow-hidden
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
                bg-gray-400 dark:bg-gray-700
                border-b border-gray-200 dark:border-gray-600
                px-4
                py-3
                font-bold
                flex
                items-center
                justify-between
                text-gray-900 dark:text-gray-200
                ">
                <div className="flex gap-2">
                    <div
                        className="
                        flex
                        items-center
                        justify-center
                        px-2
                        py-1
                        text-small
                        rounded-full
                        ">
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
                    text-gray-400 dark:text-gray-500
                    hover:text-gray-300
                    stroke-gray-500
                    hover:stroke-rose-500
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
            scroll-smooth
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
                    justify-center
                    rounded-md
                    p-4
                    bg-white dark:bg-gray-800
                    text-gray-400 dark:text-gray-500
                    hover:text-gray-300
                    stroke-gray-500
                    hover:stroke-rose-500
                    transition-all
                    "
                    onClick={() => {
                        createTask(column.id)
                    }}
                >
                    <AddCircleOutlineIcon/>
                    Add a task
                </button>
            </div>
        </div>
    )

}

export default ColumnComponent;