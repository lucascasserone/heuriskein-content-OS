# Instagram Manager - Developer Implementation Guide

## 📝 Complete Code Examples

---

## 1. State Management

### Initialize Post State
```tsx
const [posts, setPosts] = useState<Post[]>([
  {
    id: 1,
    caption: 'Beautiful sunset over the mountains',
    type: 'Image',
    status: 'scheduled',
    date: '2024-04-15',
  },
  // ... more posts
])
```

### Modal State
```tsx
const [isModalOpen, setIsModalOpen] = useState(false)
```

### Form State
```tsx
const [formData, setFormData] = useState({
  caption: '',
  type: 'Image',
  status: 'draft',
  date: '',
})
```

### Available Options
```tsx
const postTypes = ['Image', 'Video', 'Carousel', 'Reel', 'Story']
const statuses = ['draft', 'scheduled', 'backlog', 'published']
```

---

## 2. Helper Functions

### Get Tab Count
```tsx
const getTabCount = (tabId: string) => {
  return posts.filter((post) => post.status === tabId).length
}

// Usage:
<span>{getTabCount('scheduled')}</span>  // Shows: 2
```

### Get Tab Posts
```tsx
const getTabPosts = (tabId: string) => {
  return posts.filter((post) => post.status === tabId)
}

// Usage:
{getTabPosts('drafts').map((post) => (
  <PostCard key={post.id} post={post} />
))}
```

### Handle Add Post
```tsx
const handleAddPost = (e: React.FormEvent) => {
  e.preventDefault()
  
  // Validate caption
  if (!formData.caption.trim()) {
    alert('Please enter a caption')
    return
  }

  // Create new post
  const newPost: Post = {
    id: Math.max(...posts.map((p) => p.id), 0) + 1,
    caption: formData.caption,
    type: formData.type,
    status: formData.status,
    date: formData.status === 'draft' || formData.status === 'backlog' 
      ? '-' 
      : formData.date,
  }

  // Add to library
  setPosts([...posts, newPost])
  
  // Reset form
  setFormData({ caption: '', type: 'Image', status: 'draft', date: '' })
  
  // Close dialog
  setIsModalOpen(false)
}
```

### Handle Delete Post
```tsx
const handleDeletePost = (id: number) => {
  setPosts(posts.filter((post) => post.id !== id))
}

// Usage:
<button onClick={() => handleDeletePost(post.id)}>Delete</button>
```

---

## 3. Dialog Component Usage

### Basic Dialog Structure
```tsx
<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogTrigger asChild>
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      New Post
    </Button>
  </DialogTrigger>
  
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogDescription>
        Add a new Instagram post to your content library
      </DialogDescription>
    </DialogHeader>
    
    {/* Form content here */}
    
  </DialogContent>
</Dialog>
```

### Dialog Props
```tsx
<Dialog
  open={isModalOpen}           // Control open state
  onOpenChange={setIsModalOpen} // Handle open/close
>
  {/* children */}
</Dialog>
```

### DialogContent Props
```tsx
<DialogContent 
  className="sm:max-w-lg"     // Max width on small screens
  // Note: Dialog handles overlay automatically
>
  {/* content */}
</DialogContent>
```

---

## 4. Form Elements

### Caption Field
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-foreground">
    Caption
  </label>
  <textarea
    value={formData.caption}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, caption: e.target.value }))
    }
    placeholder="Write your post caption here..."
    className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
    rows={3}
  />
</div>
```

### Post Type Dropdown
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-foreground">
    Post Type
  </label>
  <select
    value={formData.type}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, type: e.target.value }))
    }
    className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
  >
    {postTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>
```

### Status Dropdown
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-foreground">
    Status
  </label>
  <select
    value={formData.status}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, status: e.target.value }))
    }
    className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
  >
    {statuses.map((status) => (
      <option key={status} value={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </option>
    ))}
  </select>
</div>
```

### Conditional Date Picker
```tsx
{formData.status === 'scheduled' && (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      Scheduled Date
    </label>
    <input
      type="date"
      value={formData.date}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, date: e.target.value }))
      }
      className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      required={formData.status === 'scheduled'}
    />
  </div>
)}
```

### Form Buttons
```tsx
<div className="flex gap-3 pt-4">
  <Button
    type="button"
    variant="outline"
    className="flex-1"
    onClick={() => setIsModalOpen(false)}
  >
    Cancel
  </Button>
  <Button
    type="submit"
    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
  >
    Create Post
  </Button>
</div>
```

---

## 5. Post Card Display

### Full Post Card
```tsx
<Card className="hover:border-primary/50 transition-colors">
  <CardContent className="pt-6">
    <div className="flex items-start justify-between gap-4">
      {/* Left: Post Info */}
      <div className="space-y-2 flex-1">
        <h3 className="font-semibold text-foreground">
          {post.caption}
        </h3>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {/* Post Type Badge */}
          <span className="inline-flex items-center rounded-full bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-200">
            {post.type}
          </span>
          
          {/* Status Badge */}
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              post.status === 'scheduled'
                ? 'bg-green-900/30 text-green-200'
                : post.status === 'published'
                  ? 'bg-emerald-900/30 text-emerald-200'
                  : post.status === 'draft'
                    ? 'bg-yellow-900/30 text-yellow-200'
                    : 'bg-gray-700/30 text-gray-300'
            }`}
          >
            {post.status}
          </span>
        </div>
      </div>
      
      {/* Right: Date & Actions */}
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">
          {post.date}
        </p>
        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 rounded text-sm bg-primary/20 hover:bg-primary/30 text-primary-foreground">
            Edit
          </button>
          <button className="px-3 py-1 rounded text-sm bg-muted hover:bg-muted/80 text-foreground">
            Preview
          </button>
          <button
            onClick={() => handleDeletePost(post.id)}
            className="px-2 py-1 rounded text-sm bg-red-900/20 hover:bg-red-900/40 text-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 6. Tab Implementation

### Tabs Container
```tsx
<Tabs defaultValue="scheduled" className="w-full">
  {/* Tab Triggers */}
  <TabsList className="grid w-full max-w-md grid-cols-4">
    {tabs.map((tab) => {
      const Icon = tab.icon
      return (
        <TabsTrigger key={tab.id} value={tab.id}>
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
            {getTabCount(tab.id)}
          </span>
        </TabsTrigger>
      )
    })}
  </TabsList>

  {/* Tab Contents */}
  {tabs.map((tab) => (
    <TabsContent key={tab.id} value={tab.id} className="space-y-4">
      {getTabPosts(tab.id).length === 0 ? (
        <EmptyState tabId={tab.id} />
      ) : (
        <div className="grid gap-4">
          {getTabPosts(tab.id).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </TabsContent>
  ))}
</Tabs>
```

---

## 7. Empty State Component

```tsx
{getTabPosts(tab.id).length === 0 ? (
  <Card className="border-dashed">
    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground">
        No posts yet in this section
      </p>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        Create First Post
      </Button>
    </CardContent>
  </Card>
) : (
  // Show posts
)}
```

---

## 8. TypeScript Interfaces

### Post Interface
```tsx
interface Post {
  id: number        // Unique identifier
  caption: string   // Post text/description
  type: string      // Image, Video, Carousel, Reel, Story
  status: string    // scheduled, draft, published, backlog
  date: string      // YYYY-MM-DD or "-"
}
```

### Form Data Interface
```tsx
interface FormData {
  caption: string
  type: string
  status: string
  date: string
}

// Initial state:
const initialFormState: FormData = {
  caption: '',
  type: 'Image',
  status: 'draft',
  date: '',
}
```

---

## 9. Advanced Features (Planned)

### Edit Post Function
```tsx
const handleEditPost = (id: number, updatedData: Partial<Post>) => {
  setPosts(posts.map((post) =>
    post.id === id ? { ...post, ...updatedData } : post
  ))
}

// Usage:
<button onClick={() => handleEditPost(post.id, { caption: 'New caption' })}>
  Edit
</button>
```

### Bulk Delete
```tsx
const handleBulkDelete = (ids: number[]) => {
  setPosts(posts.filter((post) => !ids.includes(post.id)))
}

// Usage with selection:
const [selectedPosts, setSelectedPosts] = useState<number[]>([])

<button onClick={() => handleBulkDelete(selectedPosts)}>
  Delete Selected
</button>
```

### Filter by Search
```tsx
const [searchQuery, setSearchQuery] = useState('')

const filteredPosts = posts.filter((post) =>
  post.caption.toLowerCase().includes(searchQuery.toLowerCase())
)

// Usage:
<input
  type="search"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search posts..."
/>
```

### Sort Posts
```tsx
const [sortBy, setSortBy] = useState<'date' | 'engagement'>('date')

const sortedPosts = [...posts].sort((a, b) => {
  if (sortBy === 'date') {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }
  // Add engagement sorting later
  return 0
})
```

---

## 10. Event Handling

### Form Submission
```tsx
const handleAddPost = (e: React.FormEvent) => {
  e.preventDefault() // Prevent page reload
  
  if (!formData.caption.trim()) {
    alert('Please enter a caption')
    return
  }

  const newPost: Post = {
    // Create post
  }

  setPosts([...posts, newPost])
  setFormData({ caption: '', type: 'Image', status: 'draft', date: '' })
  setIsModalOpen(false)
}

// Form usage:
<form onSubmit={handleAddPost}>
  {/* form fields */}
  <button type="submit">Create Post</button>
</form>
```

### Input Change Handlers
```tsx
// Textarea
onChange={(e) => setFormData((prev) => ({ 
  ...prev, 
  caption: e.target.value 
}))}

// Select/Dropdown
onChange={(e) => setFormData((prev) => ({ 
  ...prev, 
  type: e.target.value 
}))}

// Date Input
onChange={(e) => setFormData((prev) => ({ 
  ...prev, 
  date: e.target.value 
}))}
```

---

## 11. Error Handling

### Form Validation
```tsx
const validateForm = (): boolean => {
  if (!formData.caption.trim()) {
    setError('Caption is required')
    return false
  }
  
  if (formData.status === 'scheduled' && !formData.date) {
    setError('Scheduled date is required')
    return false
  }
  
  return true
}
```

### With State
```tsx
const [error, setError] = useState<string | null>(null)

const handleAddPost = (e: React.FormEvent) => {
  e.preventDefault()
  setError(null) // Clear previous errors
  
  if (!validateForm()) {
    return // Validation failed
  }
  
  // Add post...
}
```

---

## 12. Testing Examples

### Unit Test for Add Post
```tsx
describe('handleAddPost', () => {
  it('should add a new post to the library', () => {
    setPosts([])
    
    const newPost = {
      caption: 'Test caption',
      type: 'Image',
      status: 'draft',
      date: '-',
    }
    
    handleAddPost(newPost)
    
    expect(posts).toHaveLength(1)
    expect(posts[0].caption).toBe('Test caption')
  })
  
  it('should not add post without caption', () => {
    const initialLength = posts.length
    
    const invalidPost = {
      caption: '',
      type: 'Image',
      status: 'draft',
      date: '-',
    }
    
    handleAddPost(invalidPost)
    
    expect(posts).toHaveLength(initialLength)
  })
})
```

---

## 13. Performance Optimization

### Memoize Post List
```tsx
import { useMemo } from 'react'

const filteredPosts = useMemo(() => {
  return posts.filter((post) => post.status === selectedTab)
}, [posts, selectedTab])
```

### Memoize Helper Functions
```tsx
import { useCallback } from 'react'

const handleDeletePost = useCallback((id: number) => {
  setPosts(posts.filter((post) => post.id !== id))
}, [posts])
```

### Use useReducer for Complex State
```tsx
const [state, dispatch] = useReducer(reducer, initialState)

const reducer = (state: POST_STATE, action: Action) => {
  switch (action.type) {
    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] }
    case 'DELETE_POST':
      return { 
        ...state, 
        posts: state.posts.filter((p) => p.id !== action.payload) 
      }
    default:
      return state
  }
}
```

---

## 14. Styling Tips

### Conditional Classes
```tsx
className={`
  inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
  ${post.status === 'scheduled' 
    ? 'bg-green-900/30 text-green-200'
    : 'bg-gray-700/30 text-gray-300'
  }
`}
```

### Using cn() Utility
```tsx
import { cn } from '@/lib/utils'

className={cn(
  'base-classes',
  post.status === 'scheduled' && 'scheduled-classes',
  post.status === 'published' && 'published-classes'
)}
```

---

## 📚 Resources

- **React Hooks**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org/docs/handbook/
- **Radix UI Dialog**: https://www.radix-ui.com/docs/primitives/components/dialog
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Developer Guide Version**: 1.0  
**Last Updated**: April 2024  
**Status**: ✅ Complete & Ready for Implementation
