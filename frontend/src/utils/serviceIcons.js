import {
  FaHeart,
  FaCrown,
  FaBirthdayCake,
  FaStar,
  FaCamera,
  FaCameraRetro,
  FaVideo,
} from 'react-icons/fa';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';

export const serviceIconMap = {
  rings: FaHeart,
  crown: FaCrown,
  cake: FaBirthdayCake,
  star: FaStar,
  camera: FaCamera,
  photo: FaCameraRetro,
  video: FaVideo,
  music: HiOutlineSpeakerWave,
};

export const getServiceIcon = (iconName) => serviceIconMap[iconName] || HiOutlineSpeakerWave;
