import os

folder_array = [
    "src/frontend/images/user_profile_icon",
]


# List and print image paths
for folder in folder_array:
    print("[")
    for filename in sorted(os.listdir(folder)):
        print(f"\"{filename}\",")
    print("]\n")

