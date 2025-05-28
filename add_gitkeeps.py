import os

EXCLUDED_DIRS = {'node_modules', '.git', '__pycache__', '.venv', 'dist', 'build'}

def is_empty_dir(path):
    return os.path.isdir(path) and not any(os.listdir(path))

def should_skip(path):
    return any(excluded in path.split(os.sep) for excluded in EXCLUDED_DIRS)

def add_gitkeeps(root='.'):
    for dirpath, dirnames, filenames in os.walk(root):
        if should_skip(dirpath):
            continue
        if is_empty_dir(dirpath):
            gitkeep_path = os.path.join(dirpath, '.gitkeep')
            open(gitkeep_path, 'a').close()
            print(f'Added .gitkeep to {dirpath}')

if __name__ == '__main__':
    add_gitkeeps()
