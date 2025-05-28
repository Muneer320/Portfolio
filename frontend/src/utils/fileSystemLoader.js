// Dynamic file system loader
export const loadFileSystem = async () => {
  try {
    const res = await fetch('/home/muneer/directory_structure.json');
    const muneerDir = await res.json();

    const fileSystem = {
      '/': {
        type: 'directory',
        children: {
          'home': {
            type: 'directory',
            children: {
              'muneer': {
                type: 'directory',
                children: muneerDir
              }
            }
          },
          'usr': {
            type: 'directory',
            children: {
              'bin': { type: 'directory', children: {} },
              'lib': { type: 'directory', children: {} }
            }
          },
          'etc': { type: 'directory', children: {} },
          'var': { type: 'directory', children: {} }
        }
      }
    };

    return fileSystem;
  } catch (error) {
    console.error('Error loading file system:', error);
    return getDefaultFileSystem();
  }
};


// Fallback file system if loading fails
const getDefaultFileSystem = () => {
  return {
    '/': {
      type: 'directory',
      children: {
        'home': {
          type: 'directory',
          children: {
            'muneer': {
              type: 'directory',
              children: {
                'Documents': {
                  type: 'directory',
                  children: {
                    'CV.txt': { type: 'file', content: 'Muneer Alam - Software Developer\n\nExperienced full-stack developer...' },
                    'Cover_Letter.txt': { type: 'file', content: 'Dear Hiring Manager...' }
                  }
                },
                'Desktop': { type: 'directory', children: {} }
              }
            }
          }
        }
      }
    }
  };
};
