import React from 'react';

import './Filters.scss';

const Filters = (props) => {
  return (
    <div className="filters">
      <div className="filter-item">
        <div className="filter-title">Поиск</div>
        <div className="filter-body">
          <input type="text" />
        </div>
      </div>
      <div className="filter-item">
        <div className="filter-title">Категории</div>
        <div className="filter-body">
          {props.isCategoriesLoading ? (
            <div className="category-item">Идёт загрузка...</div>
          ) : (
            <>
              {props.categories.map((item, index) => (
                <div className="category-item" key={index}>
                  {item}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <div className="filter-item budget">
        <div className="filter-title">Бюджет</div>
        <div className="filter-body">
          <input type="text" placeholder="От" />
          <input type="text" placeholder="До" />
        </div>
      </div>
      <div className="filter-item primary-button">
        <span>Применить</span>
      </div>
    </div>
  );
};

export default Filters;
