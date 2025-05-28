import os
import json


def create_json_from_structure(structure, base_path):
    result = {}

    for item in os.listdir(base_path):
        item_path = os.path.join(base_path, item)
        if os.path.isdir(item_path):
            result[item] = {
                "type": "directory",
                "children": create_json_from_structure(structure, item_path)
            }
        else:
            if item not in ["structureMaker.py", "directory_structure.json", ".gitkeep"]:
                result[item] = {
                    "type": "file"
                }

    return result


def main():
    base_path = os.path.dirname(os.path.abspath(__file__))
    base_structure = {
        'Documents': {type: 'directory', "children": {}},
        'Downloads': {type: 'directory', "children": {}},
        'Desktop': {type: 'directory', "children": {}},
        'Pictures': {type: 'directory', "children": {}},
        'Music': {type: 'directory', "children": {}}
    }

    structure = create_json_from_structure(base_structure, base_path)
    output_file = os.path.join(base_path, "directory_structure.json")

    with open(output_file, 'w') as f:
        json.dump(structure, f, indent=4)

    print(f"Directory structure saved to {output_file}")


if __name__ == "__main__":
    main()
