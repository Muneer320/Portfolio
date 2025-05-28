import { loadFileSystem } from './fileSystemLoader';

export const executeSystemCommand = async (command, currentPath, setCurrentPath) => {
  const args = command.trim().split(' ');
  const cmd = args[0].toLowerCase();
  let output = '';

  const fileSystem = await loadFileSystem();

  const getDirectoryContents = (path) => {
    const pathParts = path.split('/').filter(p => p);
    let currentDir = fileSystem['/'];
    
    for (let part of pathParts) {
      if (currentDir.children && currentDir.children[part]) {
        currentDir = currentDir.children[part];
      } else {
        return null;
      }
    }
    
    return currentDir.children || {};
  };

  const getFileContent = (path) => {
    const pathParts = path.split('/').filter(p => p);
    let currentItem = fileSystem['/'];
    
    for (let part of pathParts) {
      if (currentItem.children && currentItem.children[part]) {
        currentItem = currentItem.children[part];
      } else {
        return null;
      }
    }
    
    return currentItem.type === 'file' ? currentItem : null;
  };

  switch (cmd) {
    case 'pwd':
      output = currentPath;
      break;
    case 'whoami':
      output = 'muneer';
      break;
    case 'date':
      output = new Date().toString();
      break;
    case 'uptime':
      output = 'System uptime: 2 days, 14:32:15';
      break;
    case 'ls':
      const contents = getDirectoryContents(currentPath);
      if (contents) {
        const items = Object.entries(contents).map(([name, item]) => 
          item.type === 'directory' ? `📁 ${name}` : `📄 ${name}`
        );
        output = items.length > 0 ? items.join('  ') : 'Directory is empty';
      } else {
        output = 'Directory not found';
      }
      break;
    case 'cd':
      if (args[1] === '..') {
        const pathParts = currentPath.split('/').filter(p => p);
        pathParts.pop();
        const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') : '/';
        setCurrentPath(newPath);
        output = '';
      } else if (args[1]) {
        let newPath;
        if (args[1].startsWith('/')) {
          newPath = args[1];
        } else {
          newPath = currentPath === '/' ? '/' + args[1] : currentPath + '/' + args[1];
        }
        
        const contents = getDirectoryContents(newPath);
        if (contents !== null) {
          setCurrentPath(newPath);
          output = '';
        } else {
          output = `cd: ${args[1]}: No such file or directory`;
        }
      } else {
        setCurrentPath('/home/muneer');
        output = '';
      }
      break;
    case 'cat':
      if (args[1]) {
        const filePath = args[1].startsWith('/') ? args[1] : currentPath + '/' + args[1];
        const fileObj = getFileContent(filePath);
        if (fileObj && fileObj.content && fileObj.content !== 'image' && fileObj.content !== 'audio') {
          output = fileObj.content;
        } else if (fileObj && (fileObj.content === 'image' || fileObj.content === 'audio')) {
          output = `cat: ${args[1]}: Is a binary file`;
        } else {
          output = `cat: ${args[1]}: No such file or directory`;
        }
      } else {
        output = 'cat: missing file operand';
      }
      break;
    default:
      output = `Command not found: ${cmd}. Type "help" for available commands.`;
  }

  return { output };
};