import os

# Folders to skip and constants
SKIP_FOLDERS = ['.git']
IMAGE_FOLDER = 'images'
MAX_IMAGES = 3

def generate_tree(path='.', prefix=''):
    tree = ''
    items = sorted(os.listdir(path))
    for i, item in enumerate(items):
        if item in SKIP_FOLDERS:
            continue

        full_path = os.path.join(path, item)
        connector = '├── ' if i < len(items) - 1 else '└── '
        tree += f"{prefix}{connector}{item}\n"

        if os.path.isdir(full_path):
            extension = '│   ' if i < len(items) - 1 else '    '

            # handling for images folder
            if IMAGE_FOLDER in full_path:
                tree += generate_image_preview(full_path, prefix + extension)
            else:
                tree += generate_tree(full_path, prefix + extension)
    return tree

def generate_image_preview(path, prefix):
    tree = ''
    items = sorted(os.listdir(path))
    count = 0
    for i, item in enumerate(items):
        full_path = os.path.join(path, item)
        connector = '├── ' if i < len(items) - 1 else '└── '

        if os.path.isdir(full_path):
            tree += f"{prefix}{connector}{item}\n"
            tree += generate_image_preview(full_path, prefix + ('│   ' if i < len(items) - 1 else '    '))
        else:
            if count < MAX_IMAGES:
                tree += f"{prefix}{connector}{item}\n"
            count += 1
    if count > MAX_IMAGES:
        tree += f"{prefix}└── ... ({count - MAX_IMAGES} more)\n"
    return tree

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate folder tree
tree = generate_tree()

# Update README between markers
start_marker = '<!-- PROJECT_STRUCTURE_START -->'
end_marker = '<!-- PROJECT_STRUCTURE_END -->'

if start_marker in content and end_marker in content:
    before = content.split(start_marker)[0]
    after = content.split(end_marker)[1]
    new_content = f"{before}{start_marker}\n```\n{tree}```\n{end_marker}{after}"
else:
    # If markers don't exist, append them
    new_content = f"{content}\n\n{start_marker}\n```\n{tree}```\n{end_marker}"

# Write back to README.md
with open('README.md', 'w', encoding='utf-8') as f:
    f.write(new_content)
