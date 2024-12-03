import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import các icon cần sử dụng
import { faEnvelope, faBell, faBars, faCircle } from '@fortawesome/free-solid-svg-icons';

// Thêm các icon vào thư viện
library.add(faEnvelope, faBell, faBars, faCircle);

export default FontAwesomeIcon;
