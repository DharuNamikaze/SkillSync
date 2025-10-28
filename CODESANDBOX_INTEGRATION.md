# CodeSandbox SDK Integration Guide

## 📋 Overview

SkillSync now uses the official **CodeSandbox SDK** to provide collaborative, cloud-based development environments for every project. When users create a project, a fully-functional sandbox is automatically created with the selected template (React, Vue, Node.js, etc.).

---

## 🚀 What's Been Implemented

### Backend Integration

1. **CodeSandbox Service** (`backend/src/services/codeSandboxService.ts`)
   - ✅ Sandbox creation with template configurations
   - ✅ Template mapping (React, Vue, Node.js)
   - ✅ Lifecycle management (hibernate, resume, delete)
   - ✅ Initial file setup for each template
   - ✅ Singleton service instance

2. **Project Service Updates** (`backend/src/services/projectService.ts`)
   - ✅ Automatic sandbox creation on project creation
   - ✅ Workspace initialization with embed URLs
   - ✅ Sandbox cleanup on project deletion

3. **Project Model** (`backend/src/models/Project.ts`)
   - ✅ `workspace` field with sandbox details:
     - `sandboxId`: Unique sandbox identifier
     - `embedUrl`: Full editor URL
     - `previewUrl`: Preview-only URL  
     - `editUrl`: Direct edit URL
     - `ideUrl`: IDE URL (alias for embedUrl)

### Frontend Integration

1. **ProjectWorkspace Component** (`frontend/src/components/ProjectWorkspace.jsx`)
   - ✅ Embed CodeSandbox iframe for editor
   - ✅ Separate preview tab with preview URL
   - ✅ Loading states for sandbox initialization
   - ✅ Error handling for missing workspaces
   - ✅ Tab-based navigation (Editor, Preview, Terminal, Chat)

2. **API Integration** (`frontend/src/lib/api.js`)
   - ✅ Fixed authentication bug (added `auth: true` to `ProjectsAPI.get()`)
   - ✅ Cleaned up debug logging

---

## 🔧 Setup Instructions

### 1. Install CodeSandbox SDK (Backend)

```bash
cd backend
npm install @codesandbox/sdk
```

### 2. Get Your API Key

1. Visit [https://codesandbox.io/t/api](https://codesandbox.io/t/api)
2. Sign in to your CodeSandbox account
3. Create a new API key
4. **Enable all scopes** (required for full functionality)
5. Copy the generated key (starts with `csb_v1_...`)

### 3. Configure Environment Variables

Add to `backend/.env`:

```env
CODESANDBOX_API_KEY=csb_v1_your_api_key_here
```

See `backend/.env.example` for full configuration template.

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

---

## 🎯 How It Works

### Project Creation Flow

1. **User creates project** via `CreateProjectModal`
2. **Backend receives request** at `POST /api/projects`
3. **Project saved to MongoDB** with initial data
4. **CodeSandbox SDK called** to create sandbox:
   ```typescript
   const sandbox = await sdk.sandboxes.create({
     template: 'node',
     title: projectName
   });
   ```
5. **Initial files written** to sandbox based on template
6. **Workspace details saved** to project document
7. **Frontend receives** project with `workspace.embedUrl`
8. **User redirected** to `ProjectWorkspace` with live IDE

### Template Mapping

| SkillSync Template | CodeSandbox Base | Initial Setup |
|-------------------|------------------|---------------|
| `react-ts` | `node` | Vite + React + TypeScript |
| `vue-ts` | `node` | Vite + Vue 3 + TypeScript |
| `node` | `node` | Express.js API |

All templates include `package.json` with proper dependencies and scripts.

### Sandbox Lifecycle

```
CREATE → ACTIVE → [HIBERNATE] → [RESUME] → DELETE
         ↑                                    ↑
         └─────── Happens automatically ──────┘
                  when project deleted
```

- **Hibernation**: Can be implemented for cost savings (pause inactive sandboxes)
- **Deletion**: Automatic when project is deleted

---

## 🎨 Frontend Usage

### Accessing the Workspace

After project creation:
```javascript
// Redirect happens automatically
window.location.href = `/projects/${projectId}/workspace`;
```

### Workspace URLs

- **Editor**: `https://codesandbox.io/p/sandbox/{sandboxId}`
- **Preview**: `https://codesandbox.io/p/sandbox/{sandboxId}?view=preview`

### Tab Navigation

- **Editor Tab**: Full CodeSandbox IDE with file tree, editor, terminal
- **Preview Tab**: Live preview of running application
- **Terminal Tab**: (Currently mock - can be integrated with CodeSandbox terminal API)
- **Chat Tab**: Team collaboration chat

---

## 📊 Cost Management

### Free Tier

- **100 VM hours/month** free
- Each sandbox consumes 1 VM hour per hour it's running
- Hibernation pauses billing

### Optimization Strategies

1. **Auto-Hibernation** (Ready to implement)
   ```typescript
   await codeSandboxService.hibernateSandbox(sandboxId);
   ```

2. **Resume on Access**
   ```typescript
   await codeSandboxService.resumeSandbox(sandboxId);
   ```

3. **Cleanup Old Projects**
   - Automatically delete sandboxes when projects are deleted ✅
   - Implement scheduled cleanup for abandoned projects

---

## 🔐 Security Considerations

### ✅ Implemented

- API key stored on backend only
- Sandboxes created server-side
- Authentication required for all operations
- Sandbox deletion on project deletion

### 🔄 Recommended

- Rate limiting for sandbox creation
- Quota enforcement per user/team
- Audit logging for sandbox operations

---

## 🐛 Troubleshooting

### Sandbox Not Creating

**Symptom**: Projects create but no workspace

**Solution**:
1. Check `CODESANDBOX_API_KEY` is set in `backend/.env`
2. Verify API key has all scopes enabled
3. Check backend console for errors:
   ```
   ⚠️  CODESANDBOX_API_KEY not set
   ```

### Iframe Not Loading

**Symptom**: Blank iframe in ProjectWorkspace

**Solution**:
1. Check browser console for CORS/CSP errors
2. Verify `sandbox` attribute in iframe:
   ```html
   sandbox="allow-forms allow-modals allow-popups 
            allow-presentation allow-same-origin allow-scripts"
   ```
3. Check if `embedUrl` exists in project data

### Authentication Error

**Symptom**: "Access token required" when accessing workspace

**Solution**:
- Already fixed! ✅ Added `auth: true` to `ProjectsAPI.get()`
- Clear browser localStorage and re-login if issue persists

---

## 🚀 Future Enhancements

### Phase 1 (Current) ✅
- [x] Basic sandbox creation
- [x] Template support
- [x] Iframe embedding
- [x] Automatic cleanup

### Phase 2 (Next)
- [ ] Auto-hibernation after inactivity
- [ ] Resume on access
- [ ] Better loading states
- [ ] Error recovery

### Phase 3 (Advanced)
- [ ] Custom file templates per project type
- [ ] Real-time collaboration indicators
- [ ] Sandbox metrics dashboard
- [ ] Cost tracking

### Phase 4 (Enterprise)
- [ ] Custom domain for previews
- [ ] White-label embedding
- [ ] Advanced VM specs
- [ ] Dedicated sandbox hosts

---

## 📚 API Reference

### CodeSandboxService Methods

```typescript
// Create sandbox
createProjectSandbox(
  projectName: string,
  sandboxTemplate: string,
  projectId?: string
): Promise<SandboxCreationResult | null>

// Hibernate sandbox (pause billing)
hibernateSandbox(sandboxId: string): Promise<boolean>

// Resume hibernated sandbox
resumeSandbox(sandboxId: string): Promise<boolean>

// Delete sandbox (cleanup)
deleteSandbox(sandboxId: string): Promise<boolean>

// Check if configured
isConfigured(): boolean
```

---

## 📖 Additional Resources

- [CodeSandbox SDK Documentation](https://codesandbox.io/docs/sdk)
- [Core Concepts](https://codesandbox.io/docs/sdk/core-concepts)
- [Templates](https://codesandbox.io/docs/sdk/templates)
- [Pricing](https://codesandbox.io/docs/sdk/pricing)
- [FAQ](https://codesandbox.io/docs/sdk/faq)

---

## 🎉 Success!

Your SkillSync installation now has full CodeSandbox SDK integration! Users can:

1. ✅ Create projects with real, working dev environments
2. ✅ Edit code in a collaborative cloud IDE
3. ✅ See live previews of their work
4. ✅ Work together in real-time
5. ✅ Access their projects from anywhere

**Next Step**: Install the CodeSandbox SDK package and add your API key to start creating sandboxes!

```bash
cd backend
npm install @codesandbox/sdk
# Then add CODESANDBOX_API_KEY to .env
```
