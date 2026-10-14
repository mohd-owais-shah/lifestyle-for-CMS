import {redirect} from 'react-router';

export const loader = () => {
  return redirect('/pages/shipping', 301);
};

export default function Route() {
  return null;
}
