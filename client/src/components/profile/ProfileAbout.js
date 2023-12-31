import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { userAnsweredQuestions } from '../../actions/auth.js';

const ProfileAbout = ({
  profile: {
    bio,
    school,
    user: { name },
  },
}) => {
  const id = useParams();

  const dispatch = useDispatch();

  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">{name.trim().split(' ')[0]}'s Bio</h2>
          <p>{bio}</p>
          <div className="line" />
          <p className="text-primary">{name}</p>
          <p className="text-primary">{school}</p>
        </Fragment>
      )}
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
