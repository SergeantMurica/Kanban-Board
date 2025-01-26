import {useMemo, useState} from 'react'
import { Column, Id, Task } from "../types.js"
import ColumnComponent from "./ColumnComponent.tsx";
import {
    DndContext,
    DragEndEvent, DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TaskCard from "./TaskCard.tsx";






const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);


    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);




    const sensors = useSensors(useSensor(PointerSensor, {
            activationConstraint: {
            distance: 5,
            },
        })
    );


    return (
        <div
            className="
            m-auto
            flex
            min-h-screen
            w-full
            bg-(--background-color)
            items-center
            overflow-x-auto
            overflow-y-hidden
            px-[40px]
            ">
            <DndContext
                sensors={sensors}
                onDragStart={dragStart}
                onDragEnd={dragEnd}
                onDragOver={dragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <ColumnComponent
                                column={column}
                                key={column.id}
                                deleteColumn={ deleteColumn }
                                updateColumn ={ updateColumn }
                                createTask={createTask}
                                tasks={ tasks.filter((task) => task.columnId === column.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={() => {
                            createNewColumn()
                        }}
                        className="
                        h-[60px]
                        w-[350px]
                        min-w-[350px]
                        cursor-pointer
                        rounded-lg
                        hover:ring-2
                        bg-(--base-color)
                        border-2
                        border-(--main-outline-color)
                        p-4
                        ring-rose-500
                        flex
                        gap-2
                        ">
                        <AddCircleOutlineIcon/>
                        Add Column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnComponent
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn ={ updateColumn }
                                createTask={createTask}
                                tasks={ tasks.filter((task) => task.columnId === activeColumn.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        )}
                        {activeTask && (
                            <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );


    /*COLUMNS*/
    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    }

    function generateId() {
        return Math.floor(Math.random() * 10001);
    }

    function deleteColumn(id: Id) {
        const columnToDelete = columns.filter((column) => column.id !== id);
        const tasksToDelete = tasks.filter((tasks) => tasks.id !== id);
        setColumns(columnToDelete);
        setTasks(tasksToDelete);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(column => {
            if (column.id !== id) return column;
            return { ...column, title };
        });
        setColumns(newColumns);
    }


    /*TASKS*/

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };
        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: Id) {
        const newTasks= tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content };
        });
        setTasks(newTasks);
    }



    /*DRAGGING*/

    function dragStart(event: DragStartEvent) {

        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function dragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;


        setColumns((columns) => {

            const activeColumnIndex = columns.findIndex((columns) => columns.id === activeId);

            const overColumnIndex = columns.findIndex((columns) => columns.id === overId);


            return arrayMove(columns, activeColumnIndex, overColumnIndex);

        });


    }


    function dragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        if (isActiveTask && isOverTask) {

            setTasks((tasks) => {

                const activeIndex = tasks.findIndex((tasks) => tasks.id === activeId);

                const overIndex = tasks.findIndex((tasks) => tasks.id === overId);

                tasks[activeIndex].columnId = tasks[overIndex].columnId;

                return arrayMove(tasks, activeIndex, overIndex);

            });
        }

        const isOverColumn = over.data.current?.type === "Column";

        if (isActiveTask && isOverColumn) {

            setTasks((tasks) => {

                const activeIndex = tasks.findIndex((tasks) => tasks.id === activeId);

                tasks[activeIndex].columnId = overId;

                return arrayMove(tasks, activeIndex, activeIndex);

            });

        }

    }

}


export default KanbanBoard;