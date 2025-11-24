import os

def generate_tree(path='.', prefix=''):
    tree = ''
    items = sorted(os.listdir(path))
    for i, item in enumerate(items):
        full_path = os.path.join(path, item)
        connector = '├── ' if i < len(items) - 1 else '└── '
        tree += f"{prefix}{connector}{item}\n"
        if os.path.isdir(full_path):
            extension = '│   ' if i < len(items) - 1 else '    '
            tree += generate_tree(full_path, prefix + extension)
    return tree

with open('README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate folder tree
tree = generate_tree()

# Update README between markers
start_marker = '<!-- FOLDER_STRUCTURE_START -->'
end_marker = '<!-- FOLDER_STRUCTURE_END -->'

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
