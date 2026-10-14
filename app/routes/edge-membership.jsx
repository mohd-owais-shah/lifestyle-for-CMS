import {redirect} from 'react-router';

export const loader = () => {
  return redirect('/pages/edge-membership', 301);
};

export default function Route() {
  return null;
}
