<script lang="ts">
	import type { todo } from "../../types/todo";
    const {task, onClickDeleteButton, onToggleCompletionStatus}:{task:todo,onClickDeleteButton:()=>void, onToggleCompletionStatus:(completion_status:1|0)=>void} = $props();
</script>

<div class="card w-100 p-3">
    <input type="checkbox" aria-label="completion status"  checked={task.is_completed===1} aria-describedby="task-title-{task.id}" onchange={(e)=>onToggleCompletionStatus(e.currentTarget.checked?1:0)}/>
    <div>
        <div id="task-title-{task.id}" class="card-title fw-bold {(task.is_completed===1)?"text-decoration-line-through":""} {(task.description.trim()==='')?'mb-0':''}">{task.title}</div>
        <div class="small">{task.description}</div>
    </div>
    <button onclick={onClickDeleteButton} title="Delete todo" aria-label="Delete todo"  aria-describedby="task-title-{task.id}">
        <img src="/Bin.svg" alt=""/>
    </button>
</div>

<style>
    .card{
        display:grid;
        grid-template-columns:min-content 1fr min-content;
        align-items:center;
        gap:2rem;

        & button{
            all:unset;
            width:1rem;
            height:1rem;
            /**
            Ensure that the image is perfectly centered in the button.
            */
            display:flex;
            align-items:center;
            justify-content:center;
        }

        & button:focus{
            outline:1px solid black;
            outline-offset:3px;
        }
    }
</style>