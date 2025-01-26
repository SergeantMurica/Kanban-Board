import {useMemo, useState} from 'react'
import { Column, Id, Task } from "../types.js"
import ColumnComponent from "./ColumnComponent.tsx";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';






const KanbanBoard = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const columnsId = useMemo(() => columns.map((column) => column.id), [columns]);

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );


    {/*COLUMNS*/}
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
        setColumns(columnToDelete);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(column => {
            if (column.id !== id) return column;
            return { ...column, title };
        });
        setColumns(newColumns);
    }


    {/*TASKS*/}

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



    {/*DRAGGING*/}

    function dragStart(event: DragStartEvent) {
        console.log("Dragging", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    function dragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((columns) => columns.id === activeColumnId);

            const overColumnIndex = columns.findIndex((columns) => columns.id === overColumnId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);

        });

    }

}


export default KanbanBoard;