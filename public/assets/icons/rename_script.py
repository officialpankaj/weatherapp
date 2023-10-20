import os

# Define the folder path where your icons are located
folder_path = './small'

# Iterate through all files in the folder
for filename in os.listdir(folder_path):
    # Split the filename by underscores
    parts = filename.split('_')
    
    # Check if the filename has at least 3 parts
    if len(parts) >= 3:
        # Extract the weather code
        weather_code = parts[0]
        
        # Extract the size description
        size_description = parts[-1].split('.')[0]
        
        # Construct the new filename
        new_filename = f'{weather_code}_{size_description}.png'
        
        # Rename the file
        old_file_path = os.path.join(folder_path, filename)
        new_file_path = os.path.join(folder_path, new_filename)
        
        # Rename the file
        os.rename(old_file_path, new_file_path)
        print(f'Renamed: {filename} => {new_filename}')
    else:
        print(f'Skipped: {filename} (Invalid format)')

print('Renaming completed.')
