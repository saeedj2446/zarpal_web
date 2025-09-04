Task Manager Pro - Professional Task Management
📋 About the Project

This project is a professional task management system built using the latest technologies in React and Next.js. The application is designed to demonstrate advanced front-end development skills and covers all the modern requirements of a web application.

🚀 Key Features
Core Features

✅ Create, edit, and delete tasks with user confirmation

✅ Toggle task status (completed/incomplete)

✅ Drag & drop to reorder tasks

✅ Local storage for data persistence

✅ Professional modal for adding new tasks

✅ Form validation powered by Zod

Advanced Features

🔍 Search and filter tasks by status

♾️ Infinite scrolling with React Query

⌨️ Keyboard shortcuts (Cmd+K for search)

📊 Task statistics and progress charts

📤 Export data to JSON/CSV formats

🌐 Offline support with connection status display

🎨 Smooth animations and interactive UI

🏗️ Technical Architecture
Technologies Used

Next.js 14 – React framework with App Router

TypeScript – complete type safety

Redux Toolkit – advanced state management

React Query (TanStack Query) – data fetching & caching

Tailwind CSS – responsive and modern styling

React Hook Form + Zod – form handling and validation

Radix UI – accessible UI components

Lucide React – modern icon library

Project Structure
├── app/                    # Next.js App Router  
├── components/  
│   ├── task-manager/       # Core components  
│   └── ui/                 # Reusable UI components  
├── lib/  
│   ├── api/                # API calls & integrations  
│   ├── hooks/              # Custom hooks  
│   ├── store/              # Redux store & slices  
│   ├── types/              # TypeScript interfaces  
│   ├── utils/              # Utility functions  
│   └── validations/        # Zod schemas  
└── scripts/                # Utility scripts

🎯 Implemented Design Patterns

Custom Hooks Pattern

useTodos – CRUD operations

useDragAndDrop – drag & drop logic

useKeyboardShortcuts – keyboard shortcuts

Optimistic Updates

Immediate UI updates before server confirmation

Automatic rollback in case of errors

Error Boundary & Fallback

Error handling across multiple levels

User-friendly error messages

Compound Components

Flexible structure for complex components

High reusability and composability

🔧 Advanced Technical Features
State Management
// Redux Toolkit with RTK Query
const todoSlice = createSlice({
name: 'todos',
initialState,
reducers: {
addTodo: (state, action) => {
state.todos.unshift(action.payload) // add to the top
},
reorderTodos: (state, action) => {
// drag & drop logic
}
}
})

React Query Integration
// Infinite Query for pagination
const todosQuery = useInfiniteQuery({
queryKey: ['todos'],
queryFn: ({ pageParam }) => todosApi.getTodos(pageParam),
getNextPageParam: (lastPage, allPages) => {
// pagination logic
}
})

Form Validation
// Zod schema validation
const createTodoSchema = z.object({
todo: z.string().min(1, "Task title is required"),
completed: z.boolean().default(false)
})

🎨 UI/UX Design
Design System

Color Palette: 4 core colors (primary, secondary, muted, destructive)

Typography: Geist for headings, system font for body text

Spacing: Tailwind’s consistent spacing system

Animations: Smooth interactions with Framer Motion

Responsive Design

Mobile-first approach

Breakpoints: sm (640px), md (768px), lg (1024px)

Flexible grid system for all screen sizes

📱 User Features
Keyboard Shortcuts

Cmd/Ctrl + K – open search

1, 2, 3 – switch filters

Escape – close modals

Drag & Drop

Reorder tasks visually

Real-time feedback during drag

Automatic saving of new order

Offline Support

Works without internet connection

Displays connectivity status

Auto-sync when back online

🔄 API Integration
DummyJSON API
// Endpoints used
GET    /todos              // Fetch task list
POST   /todos/add          // Create new task
PUT    /todos/{id}         // Update task
DELETE /todos/{id}         // Delete task

Error Handling

Retry mechanism for failed requests

LocalStorage fallback when offline

User-friendly error messages

🧪 Code Quality
TypeScript Coverage

100% type coverage

Strict mode enabled

Complete interfaces for all data

Performance Optimizations

React.memo for heavy components

useMemo and useCallback where appropriate

Lazy loading for non-critical components

Image optimization with Next.js

Code Quality

ESLint and Prettier setup

Consistent naming conventions

Clean Architecture principles

SOLID principles applied

🚀 How to Run
Prerequisites

Node.js 18+

npm or yarn

Installation Steps
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run production build
npm start

📈 Performance Metrics
Core Web Vitals

LCP: < 2.5s (Largest Contentful Paint)

FID: < 100ms (First Input Delay)

CLS: < 0.1 (Cumulative Layout Shift)

Bundle Size

Initial bundle: ~200KB gzipped

Lazy-loaded chunks for optimization

🔮 Future Features
Phase 2

User authentication

Task sharing

Reminders & notifications

Multiple themes (Dark/Light mode)

PWA support

Technical Enhancements

Unit & integration tests

E2E testing with Playwright

CI/CD pipeline

Docker containerization

👨‍💻 Developer Notes
Implemented Best Practices

Separation of Concerns – business logic separated from UI

DRY Principle – no code duplication

KISS Principle – keep it simple

Composition over Inheritance – flexible component design

Custom Hooks Example
const { todos, createTodo, isLoading } = useTodos()
const { draggedTodo, handleDragStart } = useDragAndDrop()

📞 Support

This project was built as a portfolio piece for a job interview, showcasing expertise in:

⚛️ Advanced React & Next.js

🔧 TypeScript & type safety

🏗️ Modern software architecture

🎨 UI/UX design principles

📱 Responsive web development

🚀 Performance optimization

🧪 Code quality & best practices

Built with ❤️ to showcase front-end development skills