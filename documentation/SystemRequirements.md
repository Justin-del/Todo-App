# System Requirements

## Security Requirements
<ul>
    <li>
        <strong>SR-01:</strong> Password must have at least 15 characters.
    </li>
</ul>

## Data Requirements

### Todos
<ul>
    <li><strong>DR-TD-01:</strong> Every todo should consist of a unique id, title,is_completed (represented as 0|1), created at, and updated at.</li>
    <li><strong>DR-TD-02:</strong> A todo can have an optional description.</li>
    <li><strong>DR-TD-03:</strong> One user can have 0 or more todos. Each todo belongs to only one user.</li>
</ul>

## Functional Requirements

### User Management Module
<ul>
    <li><strong>FR-UM-01:</strong> Users can sign up using an email address and password.</li>
    <li><strong>FR-UM-02:</strong> Users can sign in using an email address and password.</li>
</ul>

### Todo Management Module
Precondition:User must be signed in.
<ul>
    <li><strong>FR-TD-01:</strong> Users can create a todo (id (created randomly using uuid on frontend), title, description, is_completed, user_id).</li>
    <li><strong>FR-TD-02:</strong> Users can edit todos that they owned.</li>
    <li><strong>FR-TD-03:</strong> Users can view the todos (title, description, is_completed) that they owned.</li>
    <li><strong>FR-TD-04:</strong> Users can remove the todos that they owned.</li>
</ul>