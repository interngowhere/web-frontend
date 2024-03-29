import { ListItem } from '@/types/List';
import { AutocompleteGetTagProps, useAutocomplete } from '@mui/base/useAutocomplete';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { CheckIcon, XIcon } from 'lucide-react';

const InputWrapper = styled('div')(
    ({ theme }) => `
    width: 100%;
    border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    border-radius: 6px;
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
  
    & input {
      background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
      color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
      height: 30px;
      box-sizing: border-box;
      padding: 4px 6px;
      width: 0;
      min-width: 30px;
      flex-grow: 1;
      border: 0;
      margin: 0;
      outline: 0;
    }
  `,
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
    label: string;
}

function Tag(props: TagProps) {
    const { label, onDelete, ...other } = props;
    return (
        <div {...other}>
            <span>{label}</span>
            <XIcon onClick={onDelete} />
        </div>
    );
}

const StyledTag = styled(Tag)<TagProps>(
    ({ theme }) => `
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
    border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;
  
    &:focus {
      border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    }
  
    & span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  
    & svg {
      font-size: 12px;
      cursor: pointer;
      padding: 4px;
    }
  `,
);

const Listbox = styled('ul')(
    ({ theme }) => `
    max-width: 600px;
    margin: 2px 56px 0 0;
    padding: 0;
    position: absolute;
    list-style: none;
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;
  
    & li {
      padding: 5px 12px;
      display: flex;
  
      & span {
        flex-grow: 1;
      }
  
      & svg {
        color: transparent;
      }
    }
  
    & li[aria-selected='true'] {
      background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
      font-weight: 600;
  
      & svg {
        color: #1890ff;
      }
    }
  
    & li.${autocompleteClasses.focused} {
      background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
      cursor: pointer;
  
      & svg {
        color: currentColor;
      }
    }
  `,
);

interface TagInputProps {
    tags: ListItem[];
    selectedTags: ListItem[];
    defaultTags: ListItem[];
    setSelectedTags: React.Dispatch<React.SetStateAction<ListItem[]>>;
}

export default function TagInput(props: TagInputProps) {
    const {
        getRootProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        defaultValue: props.defaultTags,
        multiple: true,
        options: props.tags,
        getOptionLabel: (option: ListItem) => option.label,
    });

    props.setSelectedTags(value);

    return (
        <div className="w-full">
            <div {...getRootProps()}>
                <InputWrapper ref={setAnchorEl} className={`w-full ${focused ? 'focused' : ''}`}>
                    {value.map((option: ListItem, index: number) => (
                        <StyledTag label={option.label} {...getTagProps({ index })} />
                    ))}
                    <input {...getInputProps()} />
                </InputWrapper>
            </div>
            {groupedOptions.length > 0 ? (
                <Listbox {...getListboxProps()}>
                    {(groupedOptions as typeof props.tags).map((option, index) => (
                        <li {...getOptionProps({ option, index })}>
                            <span>{option.label}</span>
                            <CheckIcon fontSize="small" />
                        </li>
                    ))}
                </Listbox>
            ) : null}
        </div>
    );
}
