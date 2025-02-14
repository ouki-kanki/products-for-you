def create_product_tag(name):
    word_arr = name.split()
    tag = ''
    
    if len(word_arr) > 1:
        tag = "".join(word[0] for word in word_arr)
    else:
        word = word_arr[0]
        vowels_removed = "".join(char for char in word if char.lower() not in ('a', 'e', 'i', 'o', 'u'))
        tag = "".join(vowels_removed[:3] if len(vowels_removed) >= 3 else vowels_removed[:2])
    
    return tag.upper()


def replace_space_with_dash(value) -> str:
    return "-".join(value.split())
