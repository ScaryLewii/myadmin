import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { uuidv4 } from '@firebase/util';

const CheckboxGroup = ({ group, checkedState, handleChange }) => {
	return (
		<FormGroup className="grid grid-cols-4 gap-x-4">
			{
				group.map( item => 
					<FormControlLabel key={uuidv4()} control={<Checkbox value={item.value} checked={checkedState.includes(item.value.toString())} onChange={handleChange} />} label={item.label} />
				)
			}
		</FormGroup>
	);
}

export default CheckboxGroup